"use client";
import React from "react";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Button } from "@/components/ui/button";


type Props = {}

export const Social = (props: Props) => {
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button size="lg" className="w-full" variant="outline" onClick={() => { }}>
                <FcGoogle className="w-5 h-5" />
            </Button>
            <Button size="lg" className="w-full" variant="outline" onClick={() => { }}>
                <FaFacebookF className="w-5 h-5" />
            </Button>
        </div>
    )
}