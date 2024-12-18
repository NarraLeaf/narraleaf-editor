import {CubeTransparentIcon} from "@heroicons/react/24/outline";
import {VerticalBox} from "@lib/utils/components";

export function Null(
    {text}: Readonly<{
        text?: string;
    }>
) {
    return (
        <>
            <VerticalBox className={"flex items-center justify-center w-full h-full"}>
                <CubeTransparentIcon className={"h-12 w-12 text-gray-300"}/>
                <span className={"text-gray-300 text-lg select-none mt-2"}>{text}</span>
            </VerticalBox>
        </>
    );
}