
import { PieChart, Pie, Cell } from 'recharts';


const voteColor = (vote: "Ja" | "Nein" | "Nicht abgestimmt" | string) => {
  if (vote === "Ja") {
    return 'var(--yes-9)'
  } else if (vote === "Nein") {
    return 'var(--no-9)'
  } else {
    return 'var(--none-9)'
  }
}

export default function ChartHalfDonut({ data, valueNamespace, labelNamespace }: {
  data: Record<string, number | string>[],
  valueNamespace: string,
  labelNamespace: string
}) {

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius,
    percent, value, name,
  }: {
    cx: number,
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
    value: number,
    name: string
  }) => {
    const modifier = 1
    const radius = innerRadius + (outerRadius - innerRadius) * 2.5;
    const x = cx + (radius * modifier) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius * modifier) * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text x={x} y={y - 18} fill="var(--gray-12)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {name}       {`${(percent * 100).toFixed(2)}%`}
        </text>
        <text x={x} y={y} fill="var(--gray-12)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${value} Stimmen`}
        </text>
      </g>
    );
  };

  return (
    <PieChart
      width={512}
      height={260}
      style={{ maxWidth: '100%', minHeight: '260px' }}
    >
      <Pie
        data={data}
        cx={200}
        cy={200}
        startAngle={180}
        endAngle={0}
        innerRadius={60}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey={valueNamespace}
        nameKey={labelNamespace}
      >
        {data.map((entry, index) => (
          <Cell
            aria-label={entry[labelNamespace].toString()}
            key={`cell-${index}`}
            fill={voteColor(entry[labelNamespace].toString())}
          //  aria-label={entry[labelNamespace]}
          />
        ))}
      </Pie>
    </PieChart>
  );
}
