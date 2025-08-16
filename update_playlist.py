import json
import requests

def get_disc_tracks(disc_number):
    """Fetch track list for a specific disc from the GitHub repository."""
    url = f"https://api.github.com/repos/emuWebview/music/contents/FINAL%20FANTASY%20VII%20REBIRTH%20Original%20Soundtrack%20[Disc%20{disc_number}]"
    response = requests.get(url)
    if response.status_code == 200:
        files = response.json()
        tracks = []
        for file in files:
            if file['name'].endswith('.mp3'):
                track_num = file['name'].split(' ', 1)[0]
                track_name = ' '.join(file['name'].split(' ')[1:]).replace('.mp3', '')
                tracks.append({
                    'id': f'd{disc_number}-{track_num}',
                    'name': track_name,
                    'file': file['download_url']
                })
        return tracks
    return []

def generate_playlist_json():
    """Generate the complete playlists.json file."""
    playlists = []
    
    # Add all 7 discs
    for disc_num in range(1, 8):
        print(f"Fetching tracks for Disc {disc_num}...")
        disc_tracks = get_disc_tracks(disc_num)
        if disc_tracks:  # Only add if we got tracks
            playlists.append({
                'id': f'ff7-rebirth-disc{disc_num}',
                'name': f'FINAL FANTASY VII REBIRTH - Disc {disc_num}',
                'description': f'Original Soundtrack Disc {disc_num}',
                'coverUrl': f'https://raw.githubusercontent.com/emuWebview/music/main/FINAL%20FANTASY%20VII%20REBIRTH%20Original%20Soundtrack%20[Disc%20{disc_num}]/cover.jpg',
                'tracks': disc_tracks
            })
    
    # Create the final JSON structure
    data = {
        'playlists': playlists
    }
    
    # Write to file
    with open('playlists.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("playlists.json has been updated successfully!")

if __name__ == "__main__":
    generate_playlist_json()
