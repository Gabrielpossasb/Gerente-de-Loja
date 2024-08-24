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
   watchedVideos: {
      videoID: string,
      watch: boolean
   }[],
   score: number,
   weeklyTrackID: string,
   fixedTrackID: string,
   createdAt: string
}

export interface trilhaFixedType {
   id: string,
   name: string,
   description: string,
   createdAt: string,
   videos: {
      videoID: string,
      watch: boolean
   }[],
}
export interface trilhaSemanaType {
   id: string,
   name: string,
   description: string,
   end: string,
   start: string,
   videos: {
      videoID: string,
      watch: boolean
   }[],
}