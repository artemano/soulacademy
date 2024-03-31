"use client";

import { Category } from "@prisma/client";
import {
    PiPersonLight,
    PiWindLight,
    PiFireLight,
    PiDropLight,
    PiInfinityLight,
    PiIntersectThreeThin,
    PiSpiralLight
} from "react-icons/pi";
import { GiRelationshipBounds, GiEmbrassedEnergy } from "react-icons/gi";
import { IconType } from "react-icons";

import { CategoryItem } from "./category-item";
import { useEffect, useState } from "react";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Cuerpo": PiPersonLight,
    "Mente": PiWindLight,
    "Espiritu": PiFireLight,
    "Emociones": PiDropLight,
    "Relaciones": GiRelationshipBounds,
    "Prosperidad": PiInfinityLight,
    "Autoconocimiento": PiIntersectThreeThin,
    "Transformación": PiSpiralLight,
    "Sanación": GiEmbrassedEnergy
};

export const Categories = ({
    items,
}: CategoriesProps) => {
    const [isMounted, seIsMounted] = useState(false);

    useEffect(() => {
        seIsMounted(true);
    }, []);

    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}


