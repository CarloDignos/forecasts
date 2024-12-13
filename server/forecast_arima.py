import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.seasonal import seasonal_decompose
import json
import sys

def arima_forecast(data, steps):
    try:
        # Load data into DataFrame
        df = pd.DataFrame(data)

        # Convert 'date' column to PeriodIndex for quarters
        df['date'] = pd.PeriodIndex(df['date'], freq='Q')

        # Aggregate collectedEgg by quarter (already aggregated in input but included for safety)
        df = df.groupby('date', as_index=False).agg({'collectedEgg': 'sum'})
        df.set_index('date', inplace=True)

        # Decompose time series into seasonal, trend, and residual components
        decomposition = seasonal_decompose(df['collectedEgg'], model='additive', period=4)  # Quarterly data

        # Extract components
        seasonal = decomposition.seasonal
        trend = decomposition.trend

        # Fit ARIMA model
        model = ARIMA(df['collectedEgg'], order=(5, 1, 0))
        model_fit = model.fit()

        # Generate forecast
        forecast = model_fit.forecast(steps=steps)
        forecast_periods = pd.period_range(start=df.index[-1], periods=steps + 1, freq='Q')[1:]

        # Prepare results
        result = {
            "dates": forecast_periods.astype(str).tolist(),
            "values": forecast.tolist(),
            "seasonal": seasonal.dropna().tolist(),
            "trend": trend.dropna().tolist(),
            "actual": df['collectedEgg'].tolist(),
            "actual_dates": df.index.astype(str).tolist()
        }

        return result

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    raw_data = sys.stdin.read()
    print(f"Raw input received: {raw_data}", file=sys.stderr)  # Log input to stderr
    input_data = json.loads(raw_data)

    # Extract data and steps
    egg_data = input_data.get('data', [])
    steps = input_data.get('steps', 5)

    print(f"Egg Data Size: {len(egg_data)}", file=sys.stderr)  # Log the size of the dataset
    print(f"Forecast Steps: {steps}", file=sys.stderr)

    # Generate the forecast
    forecast_result = arima_forecast(egg_data, steps)

    # Log forecast result or error
    if "error" in forecast_result:
        print(f"Forecast Error: {forecast_result['error']}", file=sys.stderr)
    else:
        print(f"Forecast Generated Successfully", file=sys.stderr)

    # Output the forecast as JSON
    print(json.dumps(forecast_result))
