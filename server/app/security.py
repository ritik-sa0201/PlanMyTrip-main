from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Cookie, HTTPException
from dotenv import load_dotenv
from app.database import users
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode["exp"] = expire

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def get_current_user(
    access_token: str = Cookie(None)
):

    if access_token is None:
        raise HTTPException(
            status_code=401,
            detail="Please Login"
        )

    try:
        print("Cookie:", access_token)
        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        print(payload)

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        db_user = users.find_one(
            {
                "email": email
            }
        )

        if db_user is None:
            raise HTTPException(
                status_code=401,
                detail="User Not Found"
            )

        return db_user

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )