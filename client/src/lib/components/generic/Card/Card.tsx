import React, { PropsWithChildren, ReactNode } from 'react'

import "./Card.scss"

interface CardProps extends PropsWithChildren {
    icon?: ReactNode;
    title?: string;
    actions?: ReactNode[];
    style?: React.CSSProperties;
}

const Card = ({ icon, title, actions, style, children }: CardProps) => {

    const renderCardTitle = () => {
        const leftContent = icon || title ? true : false;
        const rightContent = actions ? true : false;

        let justify = "flex-start";
        if (leftContent && rightContent) {
            justify = "space-between"
        } else if (rightContent) {
            justify = "flex-end"
        }

        return (
            <div className="custom-card-title">
                {leftContent &&
                <div>
                    {icon}
                    {title}
                </div>
                }
                {rightContent &&
                <div>
                    {actions}
                </div>
                }
            </div>
        )
    }

    return (
        <div className="custom-card" style={style}>
            {(icon || title || actions) && renderCardTitle()}
            <div className='custom-card-body'>
                {children}
            </div>
        </div>
    )
}

export default Card