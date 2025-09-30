export default function ChartMini({ data, type = 'line', width = 200, height = 100 }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getPath = () => {
    if (type === 'line') {
      return data
        .map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 40) + 20;
          const y = height - 20 - ((d.value - minValue) / range) * (height - 40);
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
    }

    return '';
  };

  const getBars = () => {
    if (type === 'bar') {
      const barWidth = (width - 40) / data.length - 4;
      return data.map((d, i) => {
        const x = (i * (width - 40)) / data.length + 20;
        const barHeight = ((d.value - minValue) / range) * (height - 40);
        const y = height - 20 - barHeight;
        
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill="var(--primary)"
            opacity={0.8}
          />
        );
      });
    }

    return null;
  };

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 'var(--space-2)' }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Data visualization */}
        {type === 'line' && (
          <>
            <path
              d={getPath()}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * (width - 40) + 20;
              const y = height - 20 - ((d.value - minValue) / range) * (height - 40);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="var(--primary)"
                />
              );
            })}
          </>
        )}

        {type === 'bar' && getBars()}

        {/* Labels */}
        <text
          x="10"
          y="15"
          fontSize="10"
          fill="var(--text-muted)"
        >
          {maxValue}
        </text>
        <text
          x="10"
          y={height - 5}
          fontSize="10"
          fill="var(--text-muted)"
        >
          {minValue}
        </text>
      </svg>
    </div>
  );
}