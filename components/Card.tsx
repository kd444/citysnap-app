interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    gradient?: boolean;
}

export default function Card({
    title,
    children,
    className = "",
    icon,
    gradient = false,
}: CardProps) {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                gradient
                    ? "bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border border-blue-100/50 shadow-lg shadow-blue-100/20"
                    : "bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg shadow-gray-100/50"
            } ${className}`}
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header with icon */}
            <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-gray-100/60">
                {icon && (
                    <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                        {icon}
                    </div>
                )}
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {title}
                </h3>
            </div>

            {/* Content */}
            <div className="relative text-gray-700 leading-relaxed">
                {children}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
}
