const StatCard = ({ title, value, subtitle, tone = 'primary' }) => {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
