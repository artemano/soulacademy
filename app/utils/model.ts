import { CourseMode } from "@prisma/client";

type StrapiResponse<T> = {
  data: T;
  message: string;
};

export interface Attribute {
  url: string;
  alternativeText?: any;
  caption?: any;
  width?: number;
  height?: number;
}

export interface Data {
  id: number;
  attributes: Attribute;
}

export interface Picture {
  data: Data;
}

export interface Button {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  type: string;
}

export interface ContentSection {
  id: number;
  __component: string;
  title: string;
  description: string;
  picture: Picture;
  buttons: Button[];
}

export interface PageAttribute {
  shortName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  heading?: any;
  description?: any;
  contentSections: ContentSection[];
}

export interface PageData {
  id: number;
  attributes: PageAttribute;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface RootObject {
  data: PageData[];
  meta: Meta;
}

export interface Program {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    slug: string;
    cover: Picture;
    target: string;
    benefits: string;
    details: string;
    price: number;
    promotional_price: number;
    poster: Picture;
    promoDate: Date | null;
    images: {
      data: [
        {
          id: number;
          attributes: {
            alternativeText: string | null;
            caption: string | null;
            url: string;
            width: number;
            height: number;
          };
        }
      ];
    };

    welcome: Picture;
    description: string;
    starts: string | null;
    ends: string | null;
    summary: string;
    isActive: boolean;
    courses: {
      data: Course[];
    };
  };
}

export interface Course {
  id: number;
  attributes: {
    title: string;
    subtitle: string;
    description: string;
    ribbon: string;
    price: number;
    promotional_price: number;
    courseId: string;
    starts: string;
    ends: string;
    mode: string;
    hero: string;
    bonus: string;
    warranty: string;
    promoDate: Date | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    teachings: string;
    cover: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: any;
          caption?: any;
          width?: number;
          height?: number;
        };
      };
    };
    chapters: {
      data: [
        {
          id: number;
          attributes: {
            title: string;
            description: string;
            published: boolean;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date;
            isFree: boolean;
            media?: Picture;
          };
        }
      ];
    };
    course_category: {
      data: {
        attributes: {
          name: string;
          slug: string;
          starts: string;
          ends: string;
        };
      };
    };
    author: {
      data: {
        attributes: {
          name: string;
          email: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
    target: string;
    benefits: string;
  };
}
export type HeroColorsData = {
  primary: string;
  secondary: string;
  bg: string;
  tertiary: string;
};

export class HeroColors {
  private _heroData: HeroColorsData = DefaultHeroColors;

  private constructor(heroData?: HeroColorsData) {
    if (!heroData) {
      this._heroData.primary = DefaultHeroColors.primary;
      this._heroData.secondary = DefaultHeroColors.secondary;
      this._heroData.tertiary = DefaultHeroColors.tertiary;
      this._heroData.bg = DefaultHeroColors.bg;
    } else {
      this._heroData.primary = heroData.primary;
      this._heroData.secondary = heroData.secondary;
      this._heroData.tertiary = heroData.tertiary;
      this._heroData.bg = heroData.bg;
    }
  }

  public get heroData(): HeroColorsData {
    return this._heroData;
  }

  public set heroData(value: HeroColorsData) {
    this._heroData = value;
  }

  public static createInstance(data?: HeroColorsData) {
    if (data) {
      return new HeroColors(data);
    } else {
      return new HeroColors();
    }
  }

  public getStyles(key?: "primary" | "secondary" | "bg" | "tertiary") {
    if (key) {
      switch (key) {
        case "primary":
          return this.heroData.primary;
        case "secondary":
          return this.heroData.secondary;
        case "tertiary":
          return this.heroData.tertiary;
        case "bg":
          return this.heroData.bg;
      }
    }
    return `${this.heroData.bg}  ${this.heroData.secondary} ${this.heroData.primary}`;
  }
}

export const DefaultHeroColors: HeroColorsData = {
  primary: "text-indigo-300",
  secondary: "text-teal-500",
  bg: "bg-black",
  tertiary: "text-slate-400",
};

export interface NewUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
}


export const CourseOptions = [
  {
    label: "Grabado", value: CourseMode.RECORDED
  },
  {
    label: "Conferencia", value: CourseMode.CONFERENCE
  },
  {
    label: "Presencial", value: CourseMode.IN_PERSON
  },
  {
    label: "Masterclass", value: CourseMode.MASTERCLASS
  },
  {
    label: "En Vivo", value: CourseMode.ONLINE
  },
  {
    label: "Taller", value: CourseMode.WORKSHOP
  }];
