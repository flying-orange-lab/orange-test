import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-sprite-canvas',
  templateUrl: './sprite-canvas.component.html',
  styleUrls: ['./sprite-canvas.component.less'],
})
export class SpriteCanvasComponent implements OnChanges {
  private http = inject(HttpClient);

  @ViewChild('spriteCanvas') spriteCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() imageUrl = '';
  @Input() isSmallImage = false;
  @Output() canvasClick = new EventEmitter<Event>();

  private lastDrawnUrl = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && this.imageUrl) {
      // ViewChild는 다음 tick에 사용 가능하므로 setTimeout으로 보장
      setTimeout(() => this.drawSpriteOnCanvas(this.imageUrl));
    }
  }

  onCanvasClick(event: Event): void {
    this.canvasClick.emit(event);
  }

  async drawSpriteOnCanvas(url: string): Promise<void> {
    if (url === this.lastDrawnUrl) return;

    url = url.replace('.png', '');

    const canvas = this.spriteCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // 1. GitHub에서 암호화된 JSON 데이터 가져오기
      const encryptedJson = await this.http
        .get<{ iv: string; value: string }>(url)
        .toPromise();

      if (!encryptedJson) return;

      // 2. 대칭키 설정 (Python 스크립트와 동일해야 함)
      // 32바이트 AES-256를 위해 패딩 처리
      const key = CryptoJS.enc.Utf8.parse(
        'world-of-best-bb2-alternative'.padEnd(32, '\0'),
      );
      const iv = CryptoJS.enc.Base64.parse(encryptedJson.iv);

      // 3. 복호화 실행
      const decrypted = CryptoJS.AES.decrypt(encryptedJson.value, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // 4. 복호화된 데이터를 UTF-8 문자열(Base64 Data URL)로 변환
      const base64Data = decrypted.toString(CryptoJS.enc.Utf8);

      // 5. 이미지 객체 생성 및 캔버스 그리기
      const img = new Image();
      img.onload = () => {
        canvas.width = 128;
        canvas.height = 128;
        ctx.imageSmoothingEnabled = false; // 픽셀 아트 선명도 유지
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 128, 128);
      };
      img.src = base64Data;
      this.lastDrawnUrl = url;
    } catch (error) {
      console.error('이미지 복호화 중 오류 발생:', error);
    }
  }
}
