import { parse, toString } from './snapraid-config';

/*
An example of a typical configuration for Unix is:

parity /mnt/diskp/snapraid.parity
content /mnt/diskp/snapraid.content
content /var/snapraid/snapraid.content
data d1 /mnt/disk1/
data d2 /mnt/disk2/
data d3 /mnt/disk3/
exclude /lost+found/
exclude /tmp/
smartctl d1 -d sat %s
smartctl d2 -d usbjmicron %s
smartctl parity -d areca,1/1 /dev/sg0
smartctl 2-parity -d areca,2/1 /dev/sg0

---

An example of a typical configuration for Windows is:

parity E:\snapraid.parity
content E:\snapraid.content
content C:\snapraid\snapraid.content
data d1 G:\array\
data d2 H:\array\
data d3 I:\array\
exclude Thumbs.db
exclude \$RECYCLE.BIN
exclude \System Volume Information
smartctl d1 -d sat %s
smartctl d2 -d usbjmicron %s
smartctl parity -d areca,1/1 /dev/arcmsr0
smartctl 2-parity -d areca,2/1 /dev/arcmsr0
*/

describe('snapraid-config', () => {
    describe('parse', () => {
        it('should filter commented lines ', () => {
            const config = parse('#parity /mnt/diskp/snapraid.parity');
            expect(config.parity1).toEqual('');
        });
        it('should parse parity from the config', () => {
            const config = parse('parity /mnt/diskp/snapraid.parity');
            expect(config.parity1).toEqual('/mnt/diskp/snapraid.parity');
        });
        it('should parse 2-parity from the config', () => {
            const config = parse('2-parity /mnt/diskq/snapraid.2-parity');
            expect(config.parity2).toEqual('/mnt/diskq/snapraid.2-parity');
        });
        it('should parse 3-parity from the config', () => {
            const config = parse('3-parity /mnt/diskr/snapraid.3-parity');
            expect(config.parity3).toEqual('/mnt/diskr/snapraid.3-parity');
        });
        it('should parse 4-parity from the config', () => {
            const config = parse('4-parity /mnt/disks/snapraid.4-parity');
            expect(config.parity4).toEqual('/mnt/disks/snapraid.4-parity');
        });
        it('should parse 5-parity from the config', () => {
            const config = parse('5-parity /mnt/diskt/snapraid.5-parity');
            expect(config.parity5).toEqual('/mnt/diskt/snapraid.5-parity');
        });
        it('should parse 6-parity from the config', () => {
            const config = parse('6-parity /mnt/disku/snapraid.6-parity');
            expect(config.parity6).toEqual('/mnt/disku/snapraid.6-parity');
        });

        it('should parse content strings', () => {
            const config = parse('content /mnt/diskp/snapraid.content');
            expect(config.content).toEqual(['/mnt/diskp/snapraid.content']);
        });

        it('should parse multiple content strings', () => {
            const config = parse('content /mnt/diskp/snapraid.content\ncontent /mnt/diskq/snapraid.content');
            expect(config.content).toEqual(['/mnt/diskp/snapraid.content', '/mnt/diskq/snapraid.content']);
        });

        it('should parse data strings', () => {
            const config = parse('data d1 /mnt/disk1/');
            expect(config.data).toEqual([{ name: 'd1', mountPath: '/mnt/disk1/' }]);
        });

        it('should parse multiple data strings', () => {
            const config = parse('data d1 /mnt/disk1/\ndata d2 /mnt/disk2/');
            expect(config.data).toEqual([{ name: 'd1', mountPath: '/mnt/disk1/' }, { name: 'd2', mountPath: '/mnt/disk2/' }]);
        });


        it('should parse exclude strings', () => {
            const config = parse('exclude /lost+found/');
            expect(config.excludePaths).toEqual(['/lost+found/']);
        });

        it('should parse multiple exclude strings', () => {
            const config = parse('exclude /lost+found/\nexclude /tmp/');
            expect(config.excludePaths).toEqual(['/lost+found/', '/tmp/']);
        });

    });
});
