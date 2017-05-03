
interface IAlbumPage {
    currentPage: number;
    totalPages: number;
    albums: IAlbum[];
    isFirstPage: boolean;
    isLastPage: boolean;
}