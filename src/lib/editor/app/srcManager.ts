
export enum SrcType {
    Image = "image",
    Audio = "audio",
}

export type SrcContent = {
    [SrcType.Image]: string;
    [SrcType.Audio]: string;
};

export type Src<T extends SrcType = SrcType> = {
    type: T;
    src: SrcContent[T];
};

export class SrcManager {
    private src: Src[] = [];

    public add(type: SrcType, src: string): void {
        this.src.push({ type, src });
    }

    public get<T extends SrcType>(type?: T): Src<T>[] {
        return type ? this.src.filter(function (src): src is Src<T> {
            return src.type === type;
        }) : [...this.src as Src<T>[]];
    }
}
