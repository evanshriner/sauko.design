import jsmediatags from 'jsmediatags/dist/jsmediatags.min';

export interface Track {
  url: string;
  title: string;
  artist: string;
}

export class AudioService {
  getTracks(): Promise<Track[]> {
    const trackFiles = ['steady220.mp3', 'summer_w_suralo.mp3'];

    const trackPromises = trackFiles.map((file) => {
      const staticUrl = `/music/${file}`;
      return new Promise<Track>((resolve, reject) => {
        fetch(staticUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch audio file: ${staticUrl}`);
            }
            return response.blob();
          })
          .then((blob) => {
            jsmediatags.read(blob, {
              onSuccess: (tag) => {
                const { title, artist } = tag.tags;
                resolve({
                  url: URL.createObjectURL(blob),
                  title: title || 'Unknown Title',
                  artist: artist || 'Unknown Artist',
                });
              },
              onError: (error) => {
                console.error('Error reading ID3 tags:', error);
                // Still resolve, but with placeholder data
                resolve({
                  url: URL.createObjectURL(blob),
                  title: 'Unknown Title',
                  artist: 'Unknown Artist',
                });
              },
            });
          })
          .catch((error) => {
            console.error(`Failed to process track ${staticUrl}:`, error);
            reject(error);
          });
      });
    });

    return Promise.all(trackPromises);
  }
}
