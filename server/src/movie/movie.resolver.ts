import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MovieInputCreate } from './movie.input';
import { Movie } from './movie.model';
import { MovieService } from './movie.service';

@Resolver(() => Movie)
export class MovieResolver {
  constructor(private movieService: MovieService) {}

  @Query(() => [Movie])
  async getAllMovies(): Promise<Movie[]> {
    console.log('fetching all movies');
    return this.movieService.getAllMovies();
  }

  @Query(() => Movie)
  async getMovieById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Movie> {
    return this.movieService.getMovieById(id);
  }

  @Mutation(() => Movie)
  async createMovie(
    @Args('movieInputCreate') movieInputCreate: MovieInputCreate,
  ): Promise<Movie> {
    return this.movieService.createMovie(movieInputCreate);
  }

  @ResolveField('movieComment', () => [String])
  async getMovieComment(@Parent() movie: Movie) {
    // call a service to get comments for specific movie, i.e:
    // this.movieCommentService.getAllMovieCommetsByMovieId(id)
    return ['Test1', 'Test2'];
  }
}
