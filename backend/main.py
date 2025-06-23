# This file is kept for legacy compatibility but no longer used
# The application now uses api.py for backend functionality

if __name__ == "__main__":
    print("This file is deprecated. Please run api.py instead.")
    import api
    api.app.run(debug=True, host='0.0.0.0', port=5000)
