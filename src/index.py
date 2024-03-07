import sys
import json
from plexapi.myplex import MyPlexAccount

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing username or password"}))
        return

    username = sys.argv[1]
    password = sys.argv[2]

    try:
        account = MyPlexAccount(username, password)
        watchlist = account.watchlist()

        removed_items = []
        for item in watchlist:
            print(f"Removing {item.title} from watchlist")
            removed_items.append(item.title)
            account.removeFromWatchlist(item)

        print(json.dumps({"removed": removed_items}))

    except Exception as e:
        error_message = str(e)
        if "(401)" in error_message:
            print(json.dumps({"error": "Authentication failed"}))
        else:
            print(json.dumps({"error": f"An error occurred: {error_message}"}))

if __name__ == '__main__':
    main()
