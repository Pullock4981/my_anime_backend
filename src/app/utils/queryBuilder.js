class QueryBuilder {
  /**
   * @param {Object} modelQuery - Mongoose query object (e.g. Anime.find())
   * @param {Object} query - Express request query object (req.query)
   */
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // 1. Search Method
  search(searchableFields) {
    const searchTerm = this.query?.searchTerm || this.query?.search;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
    return this;
  }

  // 2. Filter Method
  filter() {
    const queryObj = { ...this.query };
    
    // Exclude fields that are processed in other methods
    const excludeFields = ['searchTerm', 'search', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle genres array filtering if passed as a string
    if (queryObj.genre) {
      queryObj.genres = { $in: [queryObj.genre] };
      delete queryObj.genre;
    }

    this.modelQuery = this.modelQuery.find(queryObj);
    return this;
  }

  // 3. Sort Method
  sort() {
    const sort = this.query?.sort?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // 4. Paginate Method
  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // 5. Select Fields Method
  fields() {
    const fields = this.query?.fields?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // 6. Meta Data Calculation (for pagination responses)
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
