

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import TimePicker from "./time-picker";

export interface DateTimePickerProps {
    date: Date;
    className?: string;
    placeholder: string;
    disabled: boolean;
    onChange: (value: Date) => void;
}
export function DateTimePicker({ date, placeholder, className, disabled, onChange }: DateTimePickerProps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP HH:mm:ss") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => onChange(value!)}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <TimePicker setDate={(value) => onChange(value!)} date={date} />
                </div>
            </PopoverContent>
        </Popover>
    );
}