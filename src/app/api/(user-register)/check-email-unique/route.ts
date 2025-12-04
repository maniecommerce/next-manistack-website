import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { z } from 'zod';
import { emailValidation } from '@/schemas/signUpSchema';
import { ApiError,ApiSuccess } from '@/types/ApiResponse';

const emailQuerySchema = z.object({
  email: emailValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams)
    const queryParams = {
  email: searchParams.get("email"),
};


    

    // Validate with zod
    const result = emailQuerySchema.safeParse(queryParams);
    console.log(result)

    if (!result.success) {
      const usernameErrors = result.error.format().email?._errors || [];
      return ApiError("Your email not right formet",400) 
    }

    const { email } = result.data;

    const existingVerifiedEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedEmail) {
      return ApiError("Email ID is already taken",400) }

    return ApiSuccess("Email is unique",200) 
  } catch (error) {
    console.error('Error checking username:', error);
    return ApiError("Error checking username",500) 
  }
}
