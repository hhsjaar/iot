Alur Sistem Monitoring Irigasi dengan Arduino
ALUR 1: SETUP DAN INISIALISASI
1.1 Startup Awal

Arduino dinyalakan dan menjalankan fungsi setup()

Inisialisasi serial monitor untuk debugging (baud rate 115200)

Setup mode pin: output untuk relay pompa, trig sensor ultrasonik; input untuk echo sensor, sensor analog

Load konfigurasi dari EEPROM (jika ada) atau gunakan default

Koneksi ke WiFi menggunakan SSID dan password yang tersimpan

Tunggu koneksi dengan timeout 10 detik

Jika WiFi terhubung, kirim ping ke server untuk konfirmasi

Jika WiFi gagal, masuk ke mode offline dengan indikator LED

1.2 Konfigurasi Default

Interval pengiriman data: 2 detik

Mode operasi: AUTO

Threshold kelembaban tanah: 30%

Threshold ketinggian air minimum: 15 cm

Threshold kekeruhan maksimum: 100 NTU

ALUR 2: PEMBACAAN SENSOR
2.1 Siklus Pembacaan

Setiap 500ms, Arduino membaca semua sensor secara berurutan

Untuk sensor ultrasonik (ketinggian air):

Trigger pin di-set HIGH selama 10μs

Ukur durasi echo kembali

Hitung jarak: (durasi × kecepatan suara) / 2

Konversi ke satuan centimeter

Untuk sensor kekeruhan:

Baca nilai analog dari pin (0-4095 untuk ESP32)

Konversi ke voltase (0-3.3V)

Hitung nilai NTU berdasarkan kalibrasi

Untuk sensor kelembaban tanah:

Baca nilai analog

Konversi ke persentase (0-100%)

Nilai rendah = kering, nilai tinggi = basah

2.2 Filter dan Validasi

Gunakan moving average untuk mengurangi noise

Validasi nilai dalam range yang masuk akal

Jika sensor error, gunakan nilai terakhir yang valid

Catat error counter untuk setiap sensor

ALUR 3: PENGIRIMAN DATA KE SERVER
3.1 Persiapan Data

Setiap interval yang ditentukan (default 2 detik)

Kumpulkan semua data sensor dalam struktur JSON

Tambahkan metadata: device ID, timestamp, status baterai

Serialize JSON menjadi string

3.2 HTTP POST Request

Buat koneksi HTTP ke endpoint server

Set header: Content-Type: application/json

Kirim data menggunakan metode POST

Tunggu response dengan timeout 5 detik

Handle response code:

200 OK: Data diterima, parse response untuk perintah

401/403: Authentication error, coba login ulang

500: Server error, tunggu dan coba lagi

Timeout: Simpan data ke buffer lokal

3.3 Error Handling

Jika gagal, coba ulang 3 kali dengan backoff

Jika tetap gagal, simpan data ke EEPROM/SD card

Turunkan interval pengiriman untuk hemat daya

Nyalakan LED indikator error

ALUR 4: KONTROL POMPA
4.1 Mode Otomatis

Setiap pembacaan sensor, evaluasi kondisi:

Jika kelembaban tanah < 30% DAN ketinggian air > 20 cm

Jika kekeruhan < 100 NTU (air bersih)

Jika pompa belum menyala selama 30 menit terakhir

Jika semua kondisi terpenuhi:

Hidupkan relay pompa

Catat waktu mulai

Kirim log ke server

Nyalakan LED indikator pompa

4.2 Mode Manual

Terima perintah dari server via HTTP response

Perintah: PUMP_ON, PUMP_OFF, MODE_AUTO, MODE_MANUAL

Eksekusi segera setelah perintah diterima

Kirim konfirmasi balik ke server

4.3 Safety Control

Monitor selama pompa menyala:

Jika ketinggian air < 10 cm: MATIKAN POMPA (emergency)

Jika kekeruhan > 150 NTU: MATIKAN POMPA

Jika durasi > 1 jam: MATIKAN POMPA (overload protection)

Log setiap safety shutdown dengan alasan

ALUR 5: KOMUNIKASI DUA ARAH
5.1 Polling Perintah

Setiap 5 detik, Arduino melakukan GET request ke endpoint kontrol

Cek perintah baru dari server

Endpoint: /api/device/commands?deviceId=ESP32_001

Response berisi queue perintah yang belum dieksekusi

5.2 Eksekusi Perintah

Parse perintah dari JSON response

Validasi perintah (checksum jika ada)

Eksekusi berdasarkan jenis perintah:

Kontrol pompa

Ubah mode operasi

Update konfigurasi

Reboot device

Firmware update (OTA)

Kirim acknowledgment ke server

5.3 Heartbeat dan Status

Setiap 30 detik, kirim heartbeat packet

Berisi: device status, free memory, uptime, error count

Server menggunakan ini untuk monitor kesehatan device

ALUR 6: OFFLINE OPERATION
6.1 Data Buffering

Jika tidak ada koneksi internet:

Simpan data sensor ke ring buffer di EEPROM

Buffer capacity: 1000 readings

Format: binary dengan header dan checksum

Ketika koneksi pulih:

Kirim semua buffered data secara berurutan

Hapus buffer setelah berhasil dikirim

6.2 Decision Making Offline

Gunakan konfigurasi lokal untuk kontrol otomatis

Log semua aksi pompa saat offline

Ketika online sync, kirim log ke server

ALUR 7: KALIBRASI DAN KONFIGURASI
7.1 Mode Kalibrasi

Diaktifkan via tombol fisik atau perintah khusus

Tampilkan nilai raw sensor via serial monitor

Simpan titik kalibrasi (low/high) ke EEPROM

Test konversi dengan nilai kalibrasi baru

7.2 Update Konfigurasi

Terima konfigurasi baru dari server

Validasi semua parameter

Simpan ke EEPROM dengan versioning

Reboot untuk apply konfigurasi baru

ALUR 8: PEMANTAUAN DAN MAINTENANCE
8.1 Self-Diagnostic

Setiap startup, lakukan self-test:

Test komunikasi dengan setiap sensor

Test relay pompa (bunyi klik)

Test WiFi connectivity

Check free memory

Log hasil diagnostic

Jika error critical, masuk ke safe mode

8.2 Error Recovery

Watchdog timer reset jika hang

Auto-reconnect WiFi jika terputus

Reset sensor jika memberikan nilai tidak valid

Clear buffer jika penuh

8.3 Power Management

Monitor tegangan baterai

Jika baterai rendah (<3.5V):

Nonaktifkan fitur non-esensial

Perpanjang interval pengiriman

Kirim low battery alert

Deep sleep mode jika menggunakan baterai

ALUR 9: SEQUENCE OPERASIONAL HARIAN
09.00 - System check, kirim status pagi
09.00-12.00 - Monitoring normal, interval 2 detik
12.00 - Peak check: baca semua sensor 10x cepat
12.00-15.00 - Jika panas terik, perpendek interval kontrol kelembaban
15.00 - Data summary dan cleanup buffer
15.00-18.00 - Monitoring normal
18.00 - Night mode: perpanjang interval ke 5 detik
22.00-06.00 - Sleep mode: hanya bangun setiap 10 detik

ALUR 10: EMERGENCY PROCEDURE
10.1 Flood Detection

Jika ketinggian air naik cepat (>5 cm/menit)

Kirim emergency alert ke server

Nyalakan alarm lokal (buzzer)

Jika tersedia, aktifkan drain pump

10.2 Sensor Failure

Jika sensor gagal memberikan data valid 10x berturut-turut

Switch ke backup sensor jika ada

Jika tidak ada backup, gunakan estimasi berdasarkan data historis

Kirim maintenance alert

10.3 Communication Lost

Jika tidak bisa connect ke server > 5 menit

Switch ke backup server jika dikonfigurasi

Jika tetap gagal, operasi offline penuh

Simpan semua data dan log untuk nanti di-sync

ALUR 11: SYNC DAN UPDATE
11.1 Data Synchronization

Saat koneksi kembali setelah offline

Kirim semua data yang tertahan

Terima update konfigurasi terbaru

Sync waktu dengan server (NTP)

11.2 Firmware Update

Cek update available via endpoint khusus

Jika ada update baru, download via HTTP

Validasi MD5 checksum

Tulis ke flash memory

Reboot ke firmware baru

ALUR 12: SHUTDOWN PROPER
12.1 Graceful Shutdown

Terima perintah shutdown dari server

Matikan pompa jika sedang menyala

Simpan state terakhir ke EEPROM

Tutup semua koneksi jaringan

Matikan sensor secara berurutan

Kirim shutdown confirmation

Masuk ke deep sleep atau matikan power

ALUR UTAMA DALAM POIN:

Start → Init → Connect → Operate

Read Sensors → Process → Validate → Store

Check Mode → Evaluate Conditions → Decide Action

Send Data → Wait Response → Process Commands

Control Pump → Monitor Safety → Log Activity

Check Connection → If Offline → Buffer Data

Periodic Tasks → Maintenance → Report Status

Error Occurs → Recovery Attempt → Alert if Critical

Sistem dirancang untuk bekerja autonomous dengan kemampuan fallback ketika komunikasi terputus. Prioritas utama adalah keamanan (safety first) untuk mencegah kerusakan akibat pompa kering atau banjir.