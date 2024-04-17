"use server";

import { RedirectType, isRedirectError, redirect } from "next/dist/client/components/redirect";
import { DEFAULT_LOGIN_REDIRECT } from '../routes';
import { signOut } from "next-auth/react";


export const logOut = async () => {
    try {
        await signOut({ redirect: false });  // redirect to home page on
    } catch (error) {
        console.log("LOGOUT ERROR", error);
        if (isRedirectError(error)) {
            console.log("REDIRECT ERROR");
            throw error;
        }
    } finally {
        console.log("FINALLY");
        redirect(DEFAULT_LOGIN_REDIRECT, RedirectType.push);
    }
}
