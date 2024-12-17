import {VerticalBox} from "@lib/utils/components";


export default function HelloPage() {

    const links = [
        {
            title: "Documentation",
            href: "/docs",
        },
        {
            title: "Examples",
            href: "/docs/examples",
        },
    ];

    return (
        <VerticalBox className={"items-center justify-center h-full w-full"}>
            <img
                src={"/static/images/logo-text-gray.png"}
                alt={"Logo"}
                width={400}
                height={400}
                className={"opacity-20 select-none drag-none min-w-[400px]"}
            />
            <VerticalBox className={"mt-4 select-none drag-none space-y-4"}>
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        target={"_blank"}
                        className={"font-light text-center decoration-0 text-primary-500 decoration-primary hover:text-primary-300"}
                    >
                        {link.title}
                    </a>
                ))}
            </VerticalBox>
        </VerticalBox>
    );
}
