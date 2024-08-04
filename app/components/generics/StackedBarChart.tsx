import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function StackedBarChart({ data }: {
    data: Record<string, number>[]
}) {
    const viewData = []

    for (let i = 0; i < data.length; i += 1) {
        const modified = data[i]
        modified.Ja = data[i].yes
        modified.Nein = data[i].no
        modified['Nicht abgestimmt'] = data[i].absent + data[i].abstention
        viewData.push(modified)
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={viewData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                dataKey="val"
            >
                <CartesianGrid strokeDasharray="3 3" style={{ stroke: 'var(--gray-5)' }} />
                <XAxis dataKey="val" />
                <YAxis />
                <Tooltip
                    labelStyle={{ color: 'var(--gray-12)', fontWeight: 700 }}
                    contentStyle={{ backgroundColor: 'var(--gray-3)' }}
                    itemStyle={{ color: 'var(--gray-12)' }}
                    cursor={{ fill: 'var(--gray-3)', opacity: 0.7 }}
                />
                <Legend />
                <Bar dataKey="Ja" stackId="a" fill="var(--yes-9)" />
                <Bar dataKey="Nein" stackId="a" fill="var(--no-9)" />
                <Bar dataKey="Nicht abgestimmt" stackId="a" fill="var(--none-9)" />
            </BarChart>
        </ResponsiveContainer>
    )
}