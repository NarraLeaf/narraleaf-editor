import React, { useState } from 'react';

const ResizablePanel = (
    {
        children,
        className,
        minSize = 100,
        defaultSize = 200,
        direction = 'vertical'
    }: Readonly<{
        children: React.ReactNode;
        className?: string;
        minSize?: number;
        defaultSize?: number;
        direction?: 'vertical' | 'horizontal';
    }>) => {

    const [size, setSize] = useState(defaultSize);

    const handleMouseDown = (e: React.MouseEvent) => {
        const startPos = direction === 'vertical' ? e.clientX : e.clientY;
        const startSize = size;

        const onMouseMove = (e: MouseEvent) => {
            const newSize = startSize + (direction === 'vertical' ? e.clientX - startPos : e.clientY - startPos);
            setSize(Math.max(minSize, newSize));
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: direction === 'vertical' ? 'row' : 'column' }} className={className}>
            {
                React.Children.map(children, (child, index) => {
                    if (index === 0) {
                        return (
                            <div style={{ width: direction === 'vertical' ? `${size}px` : '100%', height: direction === 'horizontal' ? `${size}px` : '100%' }}>
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
                                        width: direction === 'vertical' ? '5px' : '100%',
                                        height: direction === 'horizontal' ? '5px' : '100%',
                                        cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
                                        background: '#ccc',
                                    }}
                                ></div>
                                <div style={{ flex: 1 }}>
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