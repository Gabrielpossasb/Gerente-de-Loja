type FormProps = {
   name: string,
   categoria: string,
   colecao: string,
   cargo: string,
   tutor: string,
}

export type VideoInfoProps = FormProps & {
   url: string,
   videoID: string,
   createdAt: string,
   questions: Question[]
}

export interface Question {
   id: string;
   text: string;
   alternatives: Alternative[];
   correctAnswerID: string;
}

interface Alternative {
   id: string;
   text: string;
}

export interface userDataType {
   email: string,
   name: string,
   displayName: string,
   loja: string,
   lojaID: string,
   acesso: string,
   uid: string,
   watchVideos: string[],
   score: number
}

export interface trilhaType {
   name: string,
   description: string,
   videos: [
       {
           videoID: string,
           watch: boolean
       }
   ],
}