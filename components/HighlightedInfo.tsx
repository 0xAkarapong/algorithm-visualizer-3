// components/HighlightedInfo.tsx

interface Props {
    info: { [key: string]: unknown }; // Flexible object to hold any info
}
export default function HighlightedInfo({ info }: Props) {
    return (
        <div class="bg-gray-200 p-4 rounded-md mb-4">
            <h3 class="text-lg font-semibold mb-2">Current Step Information:</h3>
            {Object.keys(info).length === 0 ? (
                <p>No information to display yet.</p>
            ) : (
                <ul>
                    {Object.entries(info).map(([key, value]) => (
                         <li key={key} class="text-sm">
                         <strong>{key}:</strong> {
                            Array.isArray(value) ? `[${value.join(', ')}]` :
                            typeof value === 'object' && value !== null ? JSON.stringify(value):
                            value
                         }
                     </li>
                    ))}
                </ul>
            )}
        </div>
    );
}