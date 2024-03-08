import sys
import json
from plexapi.myplex import MyPlexAccount

def main():
    if len(sys.argv) < 3:
        print("Missing username or password")
        return

    username = sys.argv[1]
    password = sys.argv[2]

    try:
        account = MyPlexAccount(username, password)
        watchlist = account.watchlist()

        removed_items = []

        for item in watchlist:
            removed_items.append(item.title)
            account.removeFromWatchlist(item)

        print(removed_items)

    except Exception as e:
        error_message = str(e)
        print(error_message)

if __name__ == '__main__':
    main()
