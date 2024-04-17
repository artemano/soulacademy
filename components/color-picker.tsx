'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import { useMemo, useState } from 'react'
import palette from "./palette.json";
import { RxTransparencyGrid } from "react-icons/rx";

export function PickerExample() {
    const [background, setBackground] = useState('#ffff')

    return (
        <div
            className="w-full h-full preview flex min-h-[350px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
            style={{ background }}
        >
            <ColorPicker background={background} setBackground={setBackground} />
        </div>
    )
}
export function ColorPicker({
    background,
    setBackground,
    className,
    isBack
}: {
    background: string
    setBackground: (background: string) => void
    className?: string,
    isBack?: boolean
}) {
    let solids: string[] = [];
    palette.colors.map((color: string) => {
        solids.push(color);
    });

    const defaultTab = useMemo(() => {
        if (background.includes('url')) return 'image'
        if (background.includes('gradient')) return 'gradient'
        return 'solid'
    }, [background])


    const handleChangeColor = (e: React.MouseEvent<HTMLButtonElement>) => {
        setBackground(e.currentTarget.value);

        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'ghost'}
                    className={cn(
                        'w-[42px] justify-start text-left font-normal p-2 m-0', isBack ? 'text-muted-foreground' : `text-${background}`,
                        className
                    )}
                >
                    <div className="w-full flex items-center">
                        {background ? (
                            <div
                                className="h-6 w-6 rounded !bg-center !bg-cover transition-all items-center justify-center flex"
                                style={!isBack ? { background: 'transparent' } : { background: `${background}` }}
                            ><span className={cn(`text-[13px] font-semibold`, isBack ? 'text-muted-foreground' : `text-[${background}]`)}>{isBack ? "Bg" : "A"}</span></div>
                        ) : (
                            <Paintbrush className="h-6 w-6" />
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="w-full mb-4">
                        <TabsTrigger className="flex-1" value="solid">
                            Solid
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
                        {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className="rounded-md h-5 w-5 cursor-pointer active:scale-105 border border-slate-200 flex items-center justify-center"
                                onClick={() => setBackground(s)}
                            >
                                {s === 'transparent' ? <RxTransparencyGrid className="h-5 w-5 rounded-md" /> : null}
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

const GradientButton = ({
    background,
    children,
}: {
    background: string
    children: React.ReactNode
}) => {
    return (
        <div
            className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
            style={{ background }}
        >
            <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
                {children}
            </div>
        </div>
    )
}