import { getAllCategories } from "@/server/category.functions";
import { queryOptions } from "@tanstack/react-query";

export const getAllCategoriesQueryOption=()=>queryOptions({
    queryKey:["categories"],
    queryFn:()=>getAllCategories()
})