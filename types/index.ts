import {z} from 'zod'
import { insertProductSchema, cartItemSchema, inserCartSchema } from '@/lib/validators'
import { Decimal } from "@prisma/client/runtime/library";

export type Product =  z.infer<typeof insertProductSchema> & {
  id:string;
  rating:string;
  createdAt:string;
  numReviews: number;
};

export type Cart  = z.infer<typeof inserCartSchema>;
export type CartItem  = z.infer<typeof cartItemSchema>;



