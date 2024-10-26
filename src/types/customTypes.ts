type FormProps = {
   name: string,
   categoria: string,
   subCategoria: string,
   cargo: string,
   tutor: string,
}

export type VideoInfoProps = FormProps & {
   url: string,
   thumbnail: string,
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
      uniqueID: string,
   }[],
   score: number,
   sale: number,
   pa: number,
   weeklyTrackID: string,
   fixedTrackID: string,
   createdAt: string,
   welcomeTrackCompleted: boolean,
}

export interface trilhaFixedType {
   id: string,
   name: string,
   description: string,
   createdAt: string,
   videos: {
      videoID: string,
      watch: boolean,
      uniqueID: string,
      isLocked: boolean
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
      watch: boolean,
      uniqueID: string,
      isLocked: boolean
   }[],
}

export interface trilhaSemanaTypeCadastro {
   id: string,
   name: string,
   description: string,
   end: string,
   start: string,
   videos: {
      videoID: string,
      uniqueID: string,
   }[],
}
export interface trilhaFixedTypeCadastro {
   id: string,
   name: string,
   description: string,
   createdAt: string,
   videos: {
      videoID: string,
      uniqueID: string,
   }[],
}

export interface videoTrilha {
   id: string;
   title: string;
   categoria: string,
   subCategoria: string,
   cargo: string,
   tutor: string,
   createdAt: string,
   thumbnail: string,
}