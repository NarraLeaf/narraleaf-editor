import React from "react";

export type EditorClickEvent = React.MouseEvent | React.TouchEvent;

type Decrement<N extends number> =
    N extends 10 ? 9 :
        N extends 9 ? 8 :
            N extends 8 ? 7 :
                N extends 7 ? 6 :
                    N extends 6 ? 5 :
                        N extends 5 ? 4 :
                            N extends 4 ? 3 :
                                N extends 3 ? 2 :
                                    N extends 2 ? 1 :
                                        N extends 1 ? 0 : never;

export type RecursiveKey<T, Depth extends number = 10> =
    Depth extends 0 ? never :
        T extends object ?
            {
                [K in keyof T]: K extends string ?
                (T[K] extends string ? `${K}` : `${K}.${RecursiveKey<T[K], Decrement<Depth>>}`)
                : never
            }[keyof T]
            : never;
export type RecursiveValue<T, Included, Depth extends number = 10> =
    Depth extends 0 ? never :
        T extends object ?
            {
                [K in keyof T]: T[K] extends Included ?
                T[K] :
                RecursiveValue<T[K], Included, Decrement<Depth>>
            }[keyof T]
            : never;
export type DivElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export type Values<T> = T[keyof T];
export type ValuesOnly<T, U> = Values<{ [K in keyof T]: T[K] extends U ? K : never }>;
export type ValuesOnlyNot<T, U> = Values<{ [K in keyof T]: T[K] extends U ? never : K }>;


