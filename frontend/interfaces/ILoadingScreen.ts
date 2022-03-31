import { NextRouter } from 'next/router';
import { IProps } from './';

export interface ILoadingScreen extends IProps{
    router: NextRouter,
}

export interface LoadingScreenState {
    error: boolean,
    loading: boolean,
    itensToLoad: number,
    itensLoaded: number,
    disableLoadingScreen: boolean,
}

export interface loadingCanvasSettings {
    canvas: HTMLCanvasElement | null,
    context: CanvasRenderingContext2D | null,
    mainColor: string,
    secondaryColor: string,
    thirdColor: string,
    fortyColor: string,
    dots: string,
    loadingText: string,
    loadingTextSize: number,
    foregroundColor: string,
    finishedPlayOut: boolean,
    frame: number,
}
