import { IDifficulty, IGameMode, IQuestionBase } from '../interfaces/';

export class Question {
    private question: any;
    private correctAnswer: string;

    public getQuestion() {
      return this.question;
    }

    public getCorrectAnswer() {
      return this.correctAnswer;
    }

    public setCorrectAnswer(correctAnswer: string) {
      this.correctAnswer = correctAnswer;
    }

    public setQuestion(question: any) {
      this.question = question;
    }

    public generateQuestion(difficulty: IDifficulty, callback: (difficulty: IDifficulty) => IQuestionBase) {
      const question = callback(difficulty);
      this.setQuestion(question.question);
      this.setCorrectAnswer(question.answer); 
    }
}

export class PitagorasQuestion extends Question {
  constructor() {
    super();

    this.generateQuestion(IDifficulty.MEDIUM, (difficulty: IDifficulty): IQuestionBase => {
      var cMaxSize: number;
      switch (difficulty) {
        case IDifficulty.EASY:
          cMaxSize = 10;
          break;
        case IDifficulty.HARD:
          cMaxSize = 1000;
          break;
        case IDifficulty.HARDCORE:
          cMaxSize = 10000;
          break;
        case IDifficulty.MEDIUM:
        default:
          cMaxSize = 100;
          break;
      }
            
      var c1 = 0;
      var c2 = 0;
      var h = 0;
      do {
        c1 = Math.floor(Math.random() * 10);
        c2 = Math.floor(Math.random() * 10);
        h = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
      } while (h % 1 !== 0);
      return {
        question: {
          c1: c1,
          c2: c2,
        },
        answer: h.toString(),
      };
    });
  }
}
