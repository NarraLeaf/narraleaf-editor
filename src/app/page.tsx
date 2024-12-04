import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          className="dark:hidden"
          src="/static/images/logo-text-blue.png"
          alt="NarraLeaf logo"
          width={280}
          height={38}
          priority
        />
        <Image
          className="hidden dark:block"
          src="/static/images/logo-text-white.png"
          alt="NarraLeaf logo"
          width={280}
          height={38}
          priority
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-primary">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 decoration-primary"
          href="https://react.narraleaf.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            className="fill-current text-primary"
          />
          Documentation
        </a>
      </footer>
    </div>
  );
}
