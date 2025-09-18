import React from "react";
import Link from "next/link";

type ButtonLinkProps = {
    text: string;
    href: string;
};

export const ButtonLink: React.FC<ButtonLinkProps> = ({ text, href }) => {
    return (
        <Link
            href={href}
            className="button-link"
        >
            {text}
        </Link>
    );
};



type ButtonProps = {
    text: string;
    onClick?: () => void;

}

export const Button: React.FC<ButtonProps> = ({text, onClick}) => {
    return (
        <button className="button-default" onClick={onClick}>
            {text}
        </button>
    );
};

export default {ButtonLink, Button};