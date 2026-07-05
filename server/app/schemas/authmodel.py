from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str