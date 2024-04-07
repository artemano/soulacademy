
import React from "react";
import { LiaChevronDownSolid } from "react-icons/lia";
import { Preview } from "./preview";

interface ExpandableCardProps {
    title: string;
    content: string;
}

const ExpandableCard = ({ title, content }: ExpandableCardProps) => {
    return (
        <div className="m-[2px] space-y-1">
            <div
                className="group flex flex-col justify-center rounded-xl bg-white border border-gray-200 p-3 text-slate-700 focus:bg-white focus:focus:border-indigo-100 focus:border-indigo-800 focus:border-2 focus:shadow-sm focus:shadow-gray-200 focus:drop-shadow-sm"
                tabIndex={1}
            >
                <div className="flex cursor-pointer items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500 group-focus:text-indigo-500  ">
                        {" "}
                        {title}{" "}
                    </span>
                    <LiaChevronDownSolid className="h-5 w-5 transition-all duration-1000 group-focus:-rotate-180" />
                </div>
                <div className="invisible h-[auto] max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000 bg-white rounded-xl focus-visible:p-4 focus-visible:bg-indigo-950">
                    <Preview
                        value={content}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpandableCard;