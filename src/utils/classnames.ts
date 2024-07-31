import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const classnames = (...classes: any[]) => twMerge(clsx(...classes));
