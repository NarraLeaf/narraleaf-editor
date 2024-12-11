import clsx from 'clsx';
import React from 'react';

const ResizablePanel = (
    {
        children,
        className,
        minSize = 100,
        direction = 'vertical',
        size,
        onResize,
    }: Readonly<{
        children: React.ReactNode;
        className?: string;
        minSize?: number;
        direction?: 'horizontal' | 'vertical';
        size: number;
        onResize: (size: number) => void;
    }>) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    function setSize(size: number) {
        onResize(size);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
        const startSize = size;

        const onMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) {
                return;
            }

            let newSize = startSize + (direction === 'horizontal' ? e.clientX - startPos : e.clientY - startPos);
            newSize = Math.max(minSize, newSize);
            if (direction === 'horizontal') {
                newSize = Math.min(newSize, window.innerWidth - minSize);
                // newSize = Math.min(newSize, containerRef.current.clientWidth - minSize);
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

    if (React.Children.toArray(children).length < 2) {
        return <div className={clsx(className, "h-full")}>{children}</div>;
    }

    return (
        <div
            style={{flexDirection: direction === 'horizontal' ? 'row' : 'column'}}
            className={clsx("flex h-full w-full max-w-full", className)}
            ref={containerRef}
        >
            {
                React.Children.map(children, (child, index) => {
                    if (index === 0) {
                        return (
                            <div style={{
                                width: direction === 'horizontal' ? `${size}px` : '100%',
                                height: direction === 'vertical' ? `${size}px` : '100%'
                            }}>
                                {child}
                            </div>
                        )
                    }
                    if (index === 1) {
                        return (
                            <>
                                <div
                                    onMouseDown={handleMouseDown}
                                    style={{
                                        width: direction === 'horizontal' ? '2px' : '100%',
                                        height: direction === 'vertical' ? '2px' : '100%',
                                        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
                                        background: '#e7e7e7',
                                    }}
                                ></div>
                                <div style={{flex: 1}}>
                                    {child}
                                </div>
                            </>
                        )
                    }
                })
            }
        </div>
    );
};

export default ResizablePanel;