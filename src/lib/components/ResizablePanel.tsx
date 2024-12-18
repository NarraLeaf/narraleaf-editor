import clsx from 'clsx';
import React from 'react';

const ResizablePanel = (
    {
        children,
        className,
        direction = 'vertical',
        reverse,
        minSize = 100,
        defaultSize = 200,
    }: Readonly<{
        children: (React.ReactElement | React.ReactElement[] | undefined | null)[];
        className?: string;
        direction?: 'horizontal' | 'vertical';
        reverse?: boolean;
        minSize?: number;
        defaultSize?: number;
    }>) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const mainElementRef = React.useRef<HTMLDivElement>(null);
    const [size, setSize] = React.useState(Math.max(minSize, defaultSize));

    const DraggerWidth = 1;
    const DraggerBoxWidth = 10;

    const handleMouseDown = (e: React.MouseEvent) => {
        const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
        const startSize = size;

        const onMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) {
                return;
            }

            let newSize = reverse
                ? startSize - (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos)
                : startSize + (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos);
            newSize = Math.max(minSize, newSize);
            if (direction === 'horizontal') {
                newSize = Math.min(newSize, containerRef.current.clientWidth - minSize);
            } else {
                newSize = Math.min(newSize, containerRef.current.clientHeight - minSize);
            }
            setSize(newSize);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const childrenArray = React.Children.toArray(children) as
        React.ReactElement<React.ClassAttributes<HTMLDivElement> & {
            hidden?: boolean;
        }>[];
    const displayChildren =
        childrenArray.filter(child => child.props.hidden !== true);
    const isSingleChild = displayChildren.length === 1;

    const style = {
        width: direction === "horizontal" && !isSingleChild ? `${Math.max(minSize, size)}px` : '100%',
        height: direction === "vertical" && !isSingleChild ? `${Math.max(minSize, size)}px` : '100%',
    };

    return (
        <div
            style={{flexDirection: direction === 'horizontal' ? 'row' : 'column'}}
            className={clsx("flex h-full w-full max-w-full", className)}
            ref={containerRef}
        >
            {
                childrenArray.map((child, index) => {
                    if (child === displayChildren[0]) {
                        return (
                            <React.Fragment key={index}>
                                <div
                                    className={"w-full h-full overflow-hidden"}
                                    style={(!reverse) ? style : {
                                        flex: 1,
                                    }}
                                    ref={reverse ? mainElementRef : undefined}
                                >
                                    {child}
                                </div>
                            </React.Fragment>
                        )
                    }
                    if (child.props.hidden === true) {
                        return (
                            <React.Fragment key={index}>
                                <div style={{
                                    display: "none",
                                    flex: 0,
                                }} hidden>
                                    {child}
                                </div>
                            </React.Fragment>
                        );
                    }
                    return (
                        <React.Fragment key={index}>
                            <div
                                style={{
                                    position: 'relative',
                                    width: direction === 'horizontal' ? `${DraggerWidth}px` : '100%',
                                    height: direction === 'vertical' ? `${DraggerWidth}px` : '100%',
                                }}
                                className={"group"}
                            >
                                <div
                                    onMouseDown={(e) => handleMouseDown(e)}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: direction === 'horizontal' ? `${DraggerBoxWidth}px` : '100%',
                                        height: direction === 'vertical' ? `${DraggerBoxWidth}px` : '100%',
                                        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
                                    }}
                                ></div>
                                <div
                                    style={{
                                        width: direction === 'horizontal' ? `${DraggerWidth}px` : '100%',
                                        height: direction === 'vertical' ? `${DraggerWidth}px` : '100%',
                                    }}
                                    className={"bg-gray-200 group-active:bg-primary group-hover:bg-primary transition-colors"}
                                ></div>
                            </div>
                            <div
                                style={reverse ? style : {
                                    flex: 1
                                }}
                                ref={!reverse ? mainElementRef : undefined}
                                className={"w-full h-full overflow-hidden"}
                            >
                                {child}
                            </div>
                        </React.Fragment>
                    )
                })
            }
        </div>
    );
};

export default ResizablePanel;