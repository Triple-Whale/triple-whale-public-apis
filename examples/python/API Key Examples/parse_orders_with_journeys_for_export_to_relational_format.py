import pandas as pd
import requests

api_key = 'INSERT_YOUR_API_KEY'
endpoint = 'https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2'
myshopify_url = 'INSERT_YOUR_SHOPIFY_URL_HERE' #e.g. 'myshopifystore.myshopify.com'
start = '2023-09-01' #YYYY-MM-DD or specific UTC timestamp
end ='2023-09-20'   #YYYY-MM-DD or specific UTC timestamp

headers = {
        'content-type': 'application/json',
        'x-api-key': api_key,
      }

# Request body
body = {
  "shop": myshopify_url,
  "startDate": start,
  "endDate": end,
  "excludeJourneyData":False
}

def get_paginated_results():
    orders_logged = 0
    orders_data = []
    while True:
        response = requests.post(endpoint, json=body, headers=headers)
        response.raise_for_status()
        data = response.json()
        orders = data['ordersWithJourneys']
        

        # Loop through orders in 'ordersWithJourneys'
        for order in orders:
            # Create a dictionary for each order
            order_number=order['order_id']
            order_data = {
                'order_id': order['order_id'],
                'order_name': order['order_name'],
                'currency': order['currency'],
                'total_price': order['total_price'],
                'customer_id': order['customer_id'],
                'created_at': order['created_at'],
                'firstClick': order['attribution']['firstClick'],
                'lastClick': order['attribution']['lastClick'],
                'fullFirstClick': order['attribution']['fullFirstClick'],
                'fullLastClick': order['attribution']['fullLastClick'],
                'lastPlatformClick': order['attribution']['lastPlatformClick'],
                'linear': order['attribution']['linear'],
                'linearAll': order['attribution']['linearAll'],
                'journey': order['journey']
            }
            # Append the dictionary to the list of orders from the page
            orders_data.append(order_data)
            
            #iterate logger
            orders_logged += 1
            
            #print log
            print(f'Logged order {order_number}. {orders_logged} total orders logged.')
        
        #handle pagination (if totalForRange is greater than count, then there are more pages to get. to paginate, pass earliest date from response into endDate of next request)    
        if 'earliestDate' in data and data['totalForRange'] != data['count']:
            body['endDate'] = data['earliestDate']
        else:
            break

        
    #create a dataframe from orders_data
    df = pd.DataFrame(orders_data)
    print(df)
    return df

if __name__ == "__main__":
    #execute the function
    df = get_paginated_results()