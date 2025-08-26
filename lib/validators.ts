import { email, z } from "zod";
import { formatNumberWithDecimal } from "./utils";

// export const currency = z.string().refine((value) => /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(value))),'Price must have exactly 2 decimal places')

export const currency = z
  .number()
  .refine((value) => /^\d+\.\d{2}$/.test(value.toFixed(2)), {
    message: "Price must have exactly 2 decimal places",
  });

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "At least 3 char long name"),
  slug: z.string().min(3, "At least 3 char long Slug"),
  category: z.string().min(3, "At least 3 char long Category"),
  brand: z.string().min(3, "At least 3 char long Brand"),
  description: z.string().min(3, "At least 3 char long Description"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least 1 image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  // price:currency,
  price: z.string().regex(/^\d+\.\d{2}$/, "Price must have exactly 2 decimal places"),
});

//signin user
export const signInFormSchema = z.object({
  email:z.string().email('Invalid email'),
  password:z.string().min(6, 'password should be at 6 chars')
})


//signup user
export const signUpFormSchema = z.object({
  email:z.string().email('Invalid email'),
  password:z.string().min(6, 'password should be at 6 chars'),
  confirmPassword:z.string().min(6, 'Confirm password should be at 6 chars'),
  name:z.string().min(3, 'User name should be at 3 chars')
}).refine((data) => data.password === data.confirmPassword,{
  message:"Password and Confirm password dont matched!",
  path:['confirmPassword']
})