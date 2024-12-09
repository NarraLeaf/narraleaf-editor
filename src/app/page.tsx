'use client'

import Image from "next/image";

const navigation = [
    {name: 'Documentation', href: '#'},
]

export default function Home() {

    return (
        <div className="bg-white min-h-screen">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">NarraLeaf</span>
                            <Image
                                alt=""
                                src="/static/images/logo-icon-blue.png"
                                className="h-8 w-auto"
                                width={32}
                                height={32}
                            />
                        </a>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm/6 font-light text-gray-900">
                                {item.name}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        {/*<div*/}
                        {/*    className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">*/}
                        {/*    Announcing our next round of funding.{' '}*/}
                        {/*    <a href="#" className="font-semibold text-indigo-600">*/}
                        {/*        <span aria-hidden="true" className="absolute inset-0"/>*/}
                        {/*        Read more <span aria-hidden="true">&rarr;</span>*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                    <div className="text-center">
                        <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                            NarraLeaf Editor
                        </h1>
                        <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                            A simple and powerful editor for creating and managing your NarraLeaf scripts.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="#"
                                className="rounded-md px-6 shadow-md transition-colors duration-100 bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </a>
                            <a href="#" className="text-sm/6 font-semibold text-primary hover:text-primary-400 transition-colors duration-100 hover:underline decoration-primary decoration-2">
                                Learn more <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
