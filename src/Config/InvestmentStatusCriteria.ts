
export const InvestmentStatusCriteria = {
  High_Risk: {
    Description:
      "Very volatile or financially weak company. High chance of losses.",
    KeyIndicators: {
      Debt_to_Equity_Ratio: "> 2",
      Current_Ratio: "< 1",
      Net_Profit_Margin: "Declining or negative",
      Revenue_Growth_YoY: "< 5%",
      Operating_Cash_Flow_vs_Net_Profit: "OCF < Net Profit",
      Management_Trustworthiness: "Low",
      Industry_Growth: "Declining/Highly uncertain",
    },
  },
  Balanced: {
    Description:
      "Decent company with moderate risk. Suitable for cautious investors.",
    KeyIndicators: {
      Debt_to_Equity_Ratio: "1 - 2",
      Current_Ratio: "1 - 1.5",
      Net_Profit_Margin: "Stable or slightly improving",
      Revenue_Growth_YoY: "5% - 10%",
      Operating_Cash_Flow_vs_Net_Profit: "OCF ≈ Net Profit",
      Management_Trustworthiness: "Moderate",
      Industry_Growth: "Stable or moderate growth",
    },
  },
  Good_Opportunity: {
    Description:
      "Strong fundamentals, consistent growth, reasonable valuation. Attractive for investment.",
    KeyIndicators: {
      Debt_to_Equity_Ratio: "< 1",
      Current_Ratio: "> 1.5",
      Net_Profit_Margin: "Consistently high or improving",
      Revenue_Growth_YoY: "> 10%",
      Operating_Cash_Flow_vs_Net_Profit: "OCF > Net Profit",
      Management_Trustworthiness: "High",
      Industry_Growth: "Growing sector",
      Valuation: "PE, PB reasonable compared to peers",
    },
  },
};

