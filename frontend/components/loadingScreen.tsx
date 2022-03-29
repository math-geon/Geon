import React, { createRef } from 'react';
import { ILoadingScreen, LoadingScreenState, loadingCanvasSettings } from '../interfaces/';
import styles from '../styles/loadingScreen.module.css';

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://geon.talesgardem.com.br' : 'http://localhost:3000';

export class LoadingScreen extends React.Component<ILoadingScreen> {
  state: LoadingScreenState = {
    error: false,
    loading: true,
    itensToLoad: 0,
    itensLoaded: 0,
  }
  canvasElement: React.MutableRefObject<null>;
  animationSettings: loadingCanvasSettings = {
    canvas: null,
    context: null,
    mainColor: '#fff',
    secondaryColor: '#fff',
    thirdColor: '#fff',
    fortyColor: '#fff',
    dots: '...',
    loadingText: 'Loading',
    loadingTextSize: 100,
    foregroundColor: '#fff',
    finishedPlayOut: false,
    frame: 0,
  }
  
  constructor(props: ILoadingScreen) {
    super(props);

    this.canvasElement = createRef();
  }

  componentDidMount(): void {
    this.canvasHandler();
    const assets = process.env.assets ? process.env.assets.toString().split(',') : [];
    this.loadAssets(assets);
  }

  loadAssets(assetsList: string[]): void {
    this.setState({
      itensToLoad: assetsList.length,
    });
    const assetsJob: Array<Promise<boolean>> = [];
    assetsList.forEach((asset) => {
      assetsJob.push(new Promise(async(resolve, reject) => {
        await fetch(`${baseUrl}/assets/${asset}`).then(async(e) => {
          if (e.status === 304) {
            this.setState({
              itensLoaded: this.state.itensLoaded + 1,
            });
            return resolve(true);
          }
          if (e.status !== 200) return reject(false);
          e.blob().then(async() => {
            this.setState({
              itensLoaded: this.state.itensLoaded + 1,
            });
            resolve(true);
          });
        });
      }));
    });

    Promise.all(assetsJob).then(() => {
      console.log('loaded assets');
      this.setState({
        loading: false,
      });
    }).catch(() => {
      console.log('error loading assets');
      this.setState({
        loading: false,
        error: true,
      });
    });
  }

  canvasEventsHandler(): void {
    const settings = this.animationSettings;
    if (!settings.context) return;
    if (!settings.canvas) return;
    const canvas = settings.canvas;
    const ctx = settings.context;
    
    var onResize = (): void => {
      if (!this.state.loading) {
        window.removeEventListener('resize', onResize);
        return;
      }
      var size = Math.max(window.innerWidth, window.innerHeight);
      canvas.width = size;
      canvas.height = size;

      const MaxSize = Math.max(window.innerWidth, window.innerHeight);
      var fontSize = MaxSize;
      do {
        fontSize -= 10;
        ctx.font = `${fontSize}px sans-serif`;
      } while (ctx.measureText(settings.loadingText).width > MaxSize / 6);
      this.animationSettings.loadingTextSize = fontSize;
    }

    onResize();
    window.addEventListener('resize', onResize);
  }

  canvasHandler(): void {
    if (!this.canvasElement.current) return;

    const canvas = this.canvasElement.current as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    this.animationSettings.canvas = canvas;
    this.animationSettings.context = context;

    this.canvasEventsHandler();
    var color = getComputedStyle(document.documentElement).getPropertyValue('--loadingScreenBackgroundColor');
    var color2 = getComputedStyle(document.documentElement).getPropertyValue('--loadingScreenSecondBackgroundColor');
    var color3 = getComputedStyle(document.documentElement).getPropertyValue('--loadingScreenThirdBackgroundColor');
    var color4 = getComputedStyle(document.documentElement).getPropertyValue('--loadingScreenFortyBackgroundColor');
    this.animationSettings.mainColor = color;
    this.animationSettings.secondaryColor = color2;
    this.animationSettings.thirdColor = color3;
    this.animationSettings.fortyColor = color4;

    const dotUpdater = setInterval(() => {
      if (!this.state.loading) {
        clearInterval(dotUpdater);
        return;
      }

      if (this.animationSettings.dots.length >= 3) {
        this.animationSettings.dots = '';
      } else {
        this.animationSettings.dots += '.';
      }
    }, 500);

    this.animationSettings.frame = 0;
    requestAnimationFrame(() => {this.canvasAnimation();});
  }

  canvasAnimation(): void {
    if (Math.floor(Math.sin(this.animationSettings.frame % 360) + 2) === 1) {
      this.animationSettings.frame += (Math.sin(this.animationSettings.frame % 360) + 2) * 60/1000;
    } else {
      this.animationSettings.frame += (Math.sin(this.animationSettings.frame % 360) + 2) * 30/1000;
    }
    const settings = this.animationSettings;
    if (!settings.context) return;
    if (!settings.canvas) return;
    const canvas = settings.canvas;
    const ctx = settings.context;


    // Clear canvas and draw background
    ctx.fillStyle = settings.mainColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "lighten";

    // Gradient 1
    const gradient1 = ctx.createRadialGradient(canvas.width, 0, 0, canvas.width, 0, canvas.width / 1.45);
    gradient1.addColorStop(0, settings.secondaryColor);
    gradient1.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient 2
    const gradient2 = ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, canvas.width / 1.45);
    gradient2.addColorStop(0, settings.thirdColor);
    gradient2.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient 3
    const gradient3 = ctx.createRadialGradient(canvas.width, canvas.height, 0, canvas.width, canvas.height, canvas.width / 1.35);
    gradient3.addColorStop(0, settings.fortyColor);
    gradient3.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    // Draw loading text
    ctx.fillStyle = settings.foregroundColor;
    ctx.font = `${settings.loadingTextSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${settings.loadingText}${settings.dots}`, canvas.width / 2, canvas.height / 2);

    // Draw the percentage and the amount of stuff already loaded
    ctx.font = `${settings.loadingTextSize / 3}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = settings.secondaryColor;
    ctx.fillText(`${Math.floor(this.state.itensLoaded / this.state.itensToLoad * 100)}% (${this.state.itensLoaded}/${this.state.itensToLoad})`, canvas.width / 2, canvas.height / 2 + settings.loadingTextSize);

    ctx.globalCompositeOperation = "lighten";

    // Draw circular progress bar around the loading text with a round cap
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = settings.secondaryColor;
    ctx.arc(canvas.width / 2, canvas.height / 2, ctx.measureText(settings.loadingText).width * 2.5, ((settings.frame % 360) * 2), Math.floor(this.state.itensLoaded / this.state.itensToLoad * 2)  * Math.PI + ((settings.frame % 360) * 2));
    ctx.lineWidth = canvas.width / 50;
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";

    if (this.state.loading) {
      requestAnimationFrame(() => {this.canvasAnimation();});
    } else if (!this.animationSettings.finishedPlayOut) {
      ctx.save();
      this.animationSettings.frame = 0;
      requestAnimationFrame(() => {this.canvasAnimationOut();});
    }
  }

  canvasAnimationOut(): void {
    // draw growing transparent circle
    const settings = this.animationSettings;
    if (!settings.context) return;
    if (!settings.canvas) return;
    const canvas = settings.canvas;
    const ctx = settings.context;

    ctx.restore();
    ctx.save();
    
    ctx.fillStyle = 'transparent';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, settings.frame, 0, 2 * Math.PI);
    ctx.clip();
    ctx.clearRect(canvas.width / 2 - settings.frame, canvas.height / 2 - settings.frame, settings.frame * 2, settings.frame * 2);

    if (settings.frame > canvas.width) {
      this.animationSettings.finishedPlayOut = true;
    } else {
      this.animationSettings.frame += canvas.width * 0.03;
    }

    
    if (!this.animationSettings.finishedPlayOut) {
      requestAnimationFrame(() => {this.canvasAnimationOut();});
    }
  }

  render(): JSX.Element {
    return <canvas id={styles.loadingScreen} ref={this.canvasElement} className={this.state.loading ? styles.loading : styles.loaded} style={{display: this.animationSettings.finishedPlayOut ? 'none' : 'block'}}/>;
  }
}
