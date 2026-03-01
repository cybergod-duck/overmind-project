import './globals.css';

export const metadata = {
    title: 'Overmind Trinity Dashboard',
    description: 'The Sovereign Architecture of the VNR Living Museum',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Recursive:wght@300;400;500;700&display=swap" rel="stylesheet" />
            </head>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
