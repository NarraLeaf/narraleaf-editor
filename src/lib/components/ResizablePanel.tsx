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
        children: React.ReactNode;
        className?: string;
        direction?: 'horizontal' | 'vertical';
        reverse?: boolean;
        minSize?: number;
        defaultSize?: number;
    }>) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [size, setSize] = React.useState(Math.max(minSize, defaultSize));

    const handleMouseDown = (e: React.MouseEvent) => {
        const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
        const startSize = size;

        const onMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) {
                return;
            }

            // let newSize = startSize + (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos);
            let newSize = reverse
                ? startSize - (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos)
                : startSize + (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos);
            newSize = Math.max(minSize, newSize);
            if (direction === 'horizontal') {
                newSize = Math.min(newSize, window.innerWidth - minSize);
            } else {
                newSize = Math.min(newSize, window.innerHeight - minSize);
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

    const style = {
        width: direction === 'horizontal' ? `${Math.max(minSize, size)}px` : '100%',
        height: direction === 'vertical' ? `${Math.max(minSize, size)}px` : '100%',
    };

    return (
        <div
            style={{flexDirection: direction === 'horizontal' ? 'row' : 'column'}}
            className={clsx("flex h-full w-full max-w-full", className)}
            ref={containerRef}
        >
            {
                React.Children.toArray(children).map((child, index, arr) => {
                    if (index === 0) {
                        return (
                            <React.Fragment key={index}>
                                <div
                                    className={"w-full h-full"}
                                    style={arr.length > 1 && !reverse ? style : {
                                        flex: 1,
                                    }}
                                >
                                    {child}
                                </div>
                            </React.Fragment>
                        )
                    }
                    return (
                        <React.Fragment key={index}>
                            <div
                                onMouseDown={handleMouseDown}
                                style={{
                                    width: direction === 'horizontal' ? '2px' : '100%',
                                    height: direction === 'vertical' ? '2px' : '100%',
                                    cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
                                    background: '#e7e7e7',
                                }}
                            ></div>
                            <div style={reverse? style : {
                                flex: 1
                            }}>
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