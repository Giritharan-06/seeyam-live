import { BarChart3, MousePointer2, Table2 } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "./CourseHeroVisual.module.css";
import CourseHeroPoster from "./CourseHeroPoster";

const sales = [
  { product: "Shoes", category: "Footwear", units: 40, price: 1500 },
  { product: "Bags", category: "Accessories", units: 80, price: 900 },
  { product: "Shirts", category: "Apparel", units: 60, price: 700 },
  { product: "Caps", category: "Accessories", units: 35, price: 350 },
  { product: "Jeans", category: "Apparel", units: 50, price: 1200 },
  { product: "Socks", category: "Footwear", units: 65, price: 150 },
];
const ticks = [100, 75, 50, 25, 0];
const units = sales.reduce((total, row) => total + row.units, 0);
const revenue = sales.reduce((total, row) => total + row.units * row.price, 0);
const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function AnalyticsHeroVisual() {
  return (
    <figure className={styles.stage} aria-label="Example sales spreadsheet and the resulting bar chart">
      <div className={styles.sheet}>
        <div className={styles.toolbar} aria-hidden="true">
          <span><Table2 size={16} /> Sales.xlsx</span>
          <span className={styles.insert}><BarChart3 size={15} /> Insert chart</span>
        </div>
        <table className={styles.cells}>
          <caption className="sr-only">Sample retail sales by product</caption>
          <colgroup><col /><col /><col /><col /></colgroup>
          <thead>
            <tr><th scope="col">Product</th><th scope="col">Category</th><th scope="col">Units</th><th scope="col">Revenue</th></tr>
          </thead>
          <tbody>
            {sales.map((row, index) => (
              <tr key={row.product} style={{ "--entry": `${1.9 + index * 0.61}s` } as CSSProperties}>
                <th scope="row">{row.product}</th>
                <td>{row.category}</td>
                <td className={styles.entryCell}><span className={styles.typed}>{row.units}</span></td>
                <td><span className={styles.calculated}>{rupees.format(row.units * row.price)}</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><th scope="row" colSpan={2}>Total</th><td>{units}</td><td>{rupees.format(revenue)}</td></tr></tfoot>
        </table>
        <div className={styles.sheetTab} aria-hidden="true">Sales summary</div>
      </div>
      <div className={styles.chart} aria-hidden="true">
        <div className={styles.chartTitle}><BarChart3 size={19} /> Units sold by product</div>
        <div className={styles.plot}>
          <div className={styles.axis}>{ticks.map(tick => <span key={tick}>{tick}</span>)}</div>
          <div className={styles.columns}>
            {sales.map((row, index) => (
              <div key={row.product} className={styles.column} style={{ "--bar-delay": `${6.7 + index * 0.11}s` } as CSSProperties}>
                <div className={styles.track}>
                  <div className={styles.bar} style={{ height: `${row.units / ticks[0] * 100}%` }}>
                    <span className={styles.amount}>{row.units}</span>
                  </div>
                </div>
                <span>{row.product}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.summary}>
          <div><span>Products</span><strong>{sales.length}</strong></div>
          <div><span>Units sold</span><strong>{units}</strong></div>
          <div><span>Total revenue</span><strong>{rupees.format(revenue)}</strong></div>
        </div>
      </div>
      <div className={styles.cursor} aria-hidden="true">
        <span className={styles.ripple} />
        <MousePointer2 size={23} fill="#171717" stroke="white" />
      </div>
      <div className={styles.wipe} aria-hidden="true" />
      <CourseHeroPoster track="analytics" />
    </figure>
  );
}
