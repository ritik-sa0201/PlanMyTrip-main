from fastapi import FastAPI, Response, Depends, APIRouter, HTTPException, status
from app.database import users
from app.schemas.authmodel import User, LoginUser
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter()


# -------------------------
# SIGNUP
# -------------------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: User):
    existing_user = users.find_one({"email": user.email})
    if existing_user:
        # 409 Conflict is the correct status for "already exists"
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user.password)
    users.insert_one(user_dict)

    return {"message": "User created successfully"}


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(login_data: LoginUser, response: Response):
    db_user = users.find_one({"email": login_data.email})

    # Same error for "no such user" and "wrong password" — don't leak
    # which one it was, that's a minor account-enumeration risk.
    if db_user is None or not verify_password(login_data.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": db_user["email"]})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=1800,
        samesite="none",
        secure=True,  # Change to True in production with HTTPS
    )

    return {
        "message": "Login successful",
        "user": {"name": db_user.get("name"), "email": db_user["email"]},
    }


# -------------------------
# LOGOUT
# -------------------------
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logout successful"}


# -------------------------
# CURRENT USER (used by the frontend on page load to check auth state)
# -------------------------
@router.get("/me")
def me(current_user=Depends(get_current_user)):
    # get_current_user should itself raise a 401 HTTPException when the
    # cookie is missing/invalid — if it currently just returns None,
    # add that raise there so this endpoint behaves correctly.
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return {"email": current_user.get("email") if isinstance(current_user, dict) else current_user}